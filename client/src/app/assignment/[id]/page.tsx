"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './page.module.css';
import { AssignmentData } from '@/store/assignmentStore';
import { socket } from '@/lib/socket';

export default function AssignmentOutput() {
  const params = useParams();
  const id = params.id as string;
  const [assignment, setAssignment] = useState<AssignmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initial fetch
    const fetchAssignment = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/assignments/${id}`);
        if (res.ok) {
          const data = await res.json();
          setAssignment(data);
        } else {
          setError('Assignment not found');
        }
      } catch (err) {
        setError('Failed to fetch assignment');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();

    // Socket.io for real-time updates
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join_assignment', id);

    socket.on('assignment_completed', (data: AssignmentData) => {
      setAssignment(data);
    });

    socket.on('assignment_status', (data) => {
      if (assignment) {
        setAssignment({ ...assignment, status: data.status });
      }
    });

    socket.on('assignment_failed', (data) => {
      setError(data.error);
    });

    return () => {
      socket.off('assignment_completed');
      socket.off('assignment_status');
      socket.off('assignment_failed');
    };
  }, [id, assignment]);

  const handleDownload = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <h2>Loading Assignment...</h2>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className={styles.errorState}>
        <h2>Oops! Something went wrong.</h2>
        <p style={{color: 'var(--danger-color)', marginTop: '1rem'}}>{error}</p>
      </div>
    );
  }

  if (assignment.status === 'processing' || assignment.status === 'pending') {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <h2>AI is generating your question paper...</h2>
        <p style={{color: 'var(--text-secondary)', marginTop: '1rem'}}>
          Please wait, this might take a few moments. We'll update this page automatically.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.actionBar}>
        <button className="btn-primary" onClick={handleDownload}>
          Download as PDF
        </button>
      </div>

      <div className={styles.paper} id="question-paper">
        <div className={styles.header}>
          <div className={styles.schoolName}>Delhi Public School, Sector-4, Bokaro</div>
          <div className={styles.subjectClass}>Subject: {assignment.topic || 'General Science'} | Class: 10th</div>
          <div className={styles.examDetails}>
            <span>Time Allowed: 60 minutes</span>
            <span>Max Marks: {assignment.totalMarks}</span>
          </div>
        </div>

        <div className={styles.studentInfo}>
          <div className={styles.infoRow}>
            <div className={styles.infoLine}>
              <span>Name:</span><div className={styles.line}></div>
            </div>
            <div className={styles.infoLine}>
              <span>Roll Number:</span><div className={styles.line} style={{ width: '100px' }}></div>
            </div>
          </div>
          <div className={styles.infoLine}>
            <span>Class/Section:</span><div className={styles.line}></div>
          </div>
        </div>

        {assignment.sections && assignment.sections.map((section, sIndex) => (
          <div key={sIndex} className={styles.section}>
            <div className={styles.sectionTitle}>{section.title}</div>
            <div className={styles.sectionInstruction}>{section.instruction}</div>
            
            <div className={styles.questionList}>
              {section.questions.map((q, qIndex) => (
                <div key={qIndex} className={styles.questionItem}>
                  <div className={styles.questionNumber}>{qIndex + 1}.</div>
                  <div className={styles.questionContent}>
                    {q.text}
                    <span className={`${styles.difficultyTag} ${styles[`tag-${q.difficulty.toLowerCase()}`]}`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <div className={styles.marks}>[{q.marks} Marks]</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
