"use client";
import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { useAssignmentStore } from '../store/assignmentStore';
import AssignmentForm from './AssignmentForm';
import Link from 'next/link';

export default function Dashboard() {
  const { assignments, setAssignments } = useAssignmentStore();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    // Fetch assignments from API
    const fetchAssignments = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/assignments`);
        if (res.ok) {
          const data = await res.json();
          setAssignments(data);
        }
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      }
    };
    fetchAssignments();
  }, [setAssignments]);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/assignments/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAssignments(assignments.filter(a => a._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
    setActiveMenu(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Assignments</h1>
        {assignments.length > 0 && (
          <Link href="/create" className="btn-primary">
            + Create Assignment
          </Link>
        )}
      </div>

      {assignments.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIllustration}>📝🔍</div>
          <h2>No Assignments yet!</h2>
          <p className={styles.emptyText}>
            Creating your first assignment is easy! Just click the button below to start creating question papers with AI.
          </p>
          <Link href="/create" className="btn-primary">
            + Create Your First Assignment
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {assignments.map((assignment) => (
            <Link href={`/assignment/${assignment._id}`} key={assignment._id} className={`card ${styles.assignmentCard}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>{assignment.topic || 'Untitled Assignment'}</div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Total Marks: {assignment.totalMarks} • Questions: {assignment.totalQuestions}
              </p>
              <div className={styles.cardFooter}>
                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                <span className={`${styles.statusBadge} ${styles[`status-${assignment.status}`]}`}>
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
