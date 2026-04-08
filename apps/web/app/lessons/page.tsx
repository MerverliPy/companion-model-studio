import { LessonAttemptPanel } from '../components/lesson-attempt-panel';

export default function LessonsPage() {
  return (
    <main>
      <p>Lessons</p>
      <h1>Run the first built-in lesson eval.</h1>
      <p>
        This first slice checks whether a saved companion draft is ready for a simple
        reflection lesson and stores the latest result in local browser storage.
      </p>
      <LessonAttemptPanel />
    </main>
  );
}
