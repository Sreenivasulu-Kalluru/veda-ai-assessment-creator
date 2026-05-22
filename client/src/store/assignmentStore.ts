import { create } from 'zustand';

export interface IQuestion {
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface AssignmentData {
  _id: string;
  topic?: string;
  dueDate: string;
  totalQuestions: number;
  totalMarks: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  sections: ISection[];
  createdAt: string;
}

interface AssignmentStore {
  assignments: AssignmentData[];
  currentAssignment: AssignmentData | null;
  setAssignments: (assignments: AssignmentData[]) => void;
  addAssignment: (assignment: AssignmentData) => void;
  updateAssignmentStatus: (id: string, status: AssignmentData['status'], data?: Partial<AssignmentData>) => void;
  setCurrentAssignment: (assignment: AssignmentData | null) => void;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignments: [],
  currentAssignment: null,
  setAssignments: (assignments) => set({ assignments }),
  addAssignment: (assignment) => set((state) => ({ assignments: [assignment, ...state.assignments] })),
  updateAssignmentStatus: (id, status, data) => set((state) => ({
    assignments: state.assignments.map((a) => a._id === id ? { ...a, status, ...data } : a),
    currentAssignment: state.currentAssignment?._id === id ? { ...state.currentAssignment, status, ...data } : state.currentAssignment
  })),
  setCurrentAssignment: (currentAssignment) => set({ currentAssignment }),
}));
