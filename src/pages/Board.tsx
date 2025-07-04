import { useParams, Navigate } from 'react-router-dom';
import { BoardPage } from '@/components/BoardPage';

export default function Board() {
  const { boardId } = useParams();

  if (!boardId) {
    return <Navigate to="/dashboard" replace />;
  }

  return <BoardPage boardId={boardId} />;
}
