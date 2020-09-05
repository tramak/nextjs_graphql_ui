import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  Task,
  TasksDocument,
  TasksQuery,
  TasksQueryVariables,
  TaskStatus,
  useChangeStatusMutation,
  useDeleteTaskMutation
} from '../generated/graphql';

interface Props {
  task: Task,
  status?: TaskStatus
}

const TaskListItem: React.FC<Props> = ({ task, status }) => {
  const [deleteTask, { loading, error }] = useDeleteTaskMutation({
    update: (cache, result) => {
      const data = cache.readQuery<TasksQuery, TasksQueryVariables>({
        query: TasksDocument,
        variables: { status },
      });

      if (data) {
        cache.writeQuery<TasksQuery, TasksQueryVariables>({
          query: TasksDocument,
          variables: { status },
          data: {
            tasks: data.tasks.filter(({ id }) => id !== result.data?.deleteTask?.id)
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

  const [changeStatus, { loading: changingStatus, error: changeStatusError }] = useChangeStatusMutation();

  const handlerChangeStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus =
      task.status === TaskStatus.Active
        ? TaskStatus.Completed
        : TaskStatus.Active;

    changeStatus(({ variables: {id: task.id, status: newStatus} }))
  };

  useEffect(() => {
    if (error) {
      alert('An error occurred.')
    }

    if (error) {
      alert('Could not change status.')
    }
  }, [error, changeStatusError]);

  return (
    <li className="task-list-item">
      <label className="checkbox">
        <input
          type="checkbox"
          onChange={handlerChangeStatus}
          checked={task.status === TaskStatus.Completed}
          disabled={changingStatus}
        />
        <span className="checkbox-mark">&#10003;</span>
      </label>
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