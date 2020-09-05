import React, { useEffect } from 'react';
import Link from "next/link";
import {
  Task,
  TasksDocument,
  TasksQuery,
  TasksQueryVariables,
  TaskStatus,
  useDeleteTaskMutation
} from '../generated/graphql';

interface Props {
  task: Task
}

const TaskListItem: React.FC<Props> = ({ task }) => {
  const [deleteTask, { loading, error }] = useDeleteTaskMutation({
    update: (cache, result) => {
      const data = cache.readQuery<TasksQuery, TasksQueryVariables>({
        query: TasksDocument,
        variables: { status: TaskStatus.Active },
      });

      if (data) {
        cache.writeQuery<TasksQuery, TasksQueryVariables>({
          query: TasksDocument,
          variables: { status: TaskStatus.Active },
          data: {
            tasks: data.tasks.filter(({ id }) => id !== task.id)
          }
        });
      }
    }
  });
  const handleDeleteClick = () => {
    deleteTask({
      variables: {
        id: task.id
      }
    });
  };

  useEffect(() => {
    if (error) {
      alert('An error occurred.')
    }
  }, [error]);

  return (
    <li className="task-list-item">
      <Link href="/update/[id]" as={`/update/${task.id}`}>
        <a className="task-list-item-title">{task.title}</a>
      </Link>
      <button
        disabled={loading}
        onClick={handleDeleteClick}
        className="task-list-item-delete"
      >
        &times;
      </button>
    </li>
  );
};

export default TaskListItem;