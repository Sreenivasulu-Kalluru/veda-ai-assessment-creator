"use client";
import AssignmentForm from '@/components/AssignmentForm';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const router = useRouter();

  return <AssignmentForm onCancel={() => router.push('/')} />;
}
