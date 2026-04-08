import { ChatWorkbench } from '../components/chat-workbench';

export default function ChatPage() {
  return (
    <main>
      <p>Local chat workbench</p>
      <h1>Chat with your companion draft.</h1>
      <p>Use the saved companion profile as local context for a first stable chat loop.</p>
      <ChatWorkbench />
    </main>
  );
}
