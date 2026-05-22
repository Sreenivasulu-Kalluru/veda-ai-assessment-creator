"use client";
import { useState, useRef } from 'react';
import styles from './AssignmentForm.module.css';
import { useAssignmentStore } from '../store/assignmentStore';
import { useRouter } from 'next/navigation';

interface Props {
  onCancel: () => void;
}

interface QuestionType {
  type: string;
  count: number;
  marks: number;
}

export default function AssignmentForm({ onCancel }: Props) {
  const [topic, setTopic] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([
    { type: 'Multiple Choice Questions', count: 5, marks: 5 },
    { type: 'Short Answer Questions', count: 2, marks: 4 },
  ]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInstructions(prev => prev ? `${prev}\n\nSource Material Context:\n${text}` : `Source Material Context:\n${text}`);
      };
      reader.readAsText(file);
    } else {
      alert("For this demo, please upload a .txt file. PDF parsing requires additional backend setup.");
    }
    
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const router = useRouter();

  const addQuestionType = () => {
    setQuestionTypes([...questionTypes, { type: 'Long Answer Questions', count: 1, marks: 5 }]);
  };

  const updateQuestionType = (index: number, field: keyof QuestionType, value: string | number) => {
    const newTypes = [...questionTypes];
    newTypes[index] = { ...newTypes[index], [field]: value };
    setQuestionTypes(newTypes);
  };

  const removeQuestionType = (index: number) => {
    setQuestionTypes(questionTypes.filter((_, i) => i !== index));
  };

  const totalQuestions = questionTypes.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);
  const totalMarks = questionTypes.reduce((acc, curr) => acc + (Number(curr.marks) || 0), 0);

  const handleSubmit = async () => {
    if (!dueDate || totalQuestions === 0 || totalMarks === 0) {
      alert("Please fill all required fields correctly.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          dueDate,
          totalQuestions,
          totalMarks,
          instructions,
          questionTypes
        })
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/assignment/${data.assignmentId}`);
      } else {
        alert("Failed to create assignment");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onCancel}>←</button>
        <h1 className={styles.title}>Create Assignment</h1>
      </div>

      <div className={styles.formContent}>
        <div className={styles.leftCol}>
          <div className={styles.formSection}>
            <div 
              className={styles.uploadZone} 
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: 'pointer', borderColor: fileName ? 'var(--primary-color)' : '' }}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".txt" 
                style={{ display: 'none' }} 
              />
              <div className={styles.uploadIcon}>📄</div>
              <h3>{fileName ? 'Material Uploaded successfully' : 'Upload material to generate'}</h3>
              <p style={{color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem'}}>
                {fileName || 'Click to browse for a .txt file'}
              </p>
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.row}>
              <div className={`${styles.inputGroup} ${styles.flex1}`}>
                <label className={styles.label}>Topic</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="E.g. Electricity, Laws of Motion" 
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                />
              </div>
              <div className={`${styles.inputGroup} ${styles.flex1}`}>
                <label className={styles.label}>Due Date *</label>
                <input 
                  type="date" 
                  className={styles.input}
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <h3 className={styles.sectionTitle} style={{marginTop: '1.5rem'}}>Question Types</h3>
            {questionTypes.map((qType, index) => (
              <div key={index} className={styles.questionTypeRow}>
                <div className={styles.flex1}>
                  <select 
                    className={styles.input}
                    value={qType.type}
                    onChange={(e) => updateQuestionType(index, 'type', e.target.value)}
                  >
                    <option value="Multiple Choice Questions">Multiple Choice Questions</option>
                    <option value="Short Answer Questions">Short Answer Questions</option>
                    <option value="Long Answer Questions">Long Answer Questions</option>
                    <option value="Numerical Problems">Numerical Problems</option>
                  </select>
                </div>
                <div style={{width: '100px'}}>
                  <input 
                    type="number" 
                    className={styles.input} 
                    placeholder="Count"
                    min="1"
                    value={qType.count}
                    onChange={(e) => updateQuestionType(index, 'count', Number(e.target.value))}
                  />
                </div>
                <div style={{width: '100px'}}>
                  <input 
                    type="number" 
                    className={styles.input} 
                    placeholder="Marks"
                    min="1"
                    value={qType.marks}
                    onChange={(e) => updateQuestionType(index, 'marks', Number(e.target.value))}
                  />
                </div>
                {questionTypes.length > 1 && (
                  <button className={styles.deleteBtn} onClick={() => removeQuestionType(index)}>×</button>
                )}
              </div>
            ))}
            <button className={styles.addBtn} onClick={addQuestionType}>
              + Add Question Type
            </button>

            <div className={styles.inputGroup} style={{marginTop: '2rem'}}>
              <label className={styles.label}>Additional Instructions (Optional)</label>
              <textarea 
                className={styles.textarea} 
                placeholder="E.g. Include some real-world application based problems"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.summaryCard}>
            <h3 className={styles.sectionTitle}>Summary</h3>
            <div className={styles.summaryRow}>
              <span>Total Questions</span>
              <span className={styles.summaryTotal}>{totalQuestions}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Total Marks</span>
              <span className={styles.summaryTotal}>{totalMarks}</span>
            </div>
            <button 
              className={`btn-primary ${styles.submitBtn}`} 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Assignment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
