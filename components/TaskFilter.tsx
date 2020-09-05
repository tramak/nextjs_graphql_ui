import React from 'react';
import Link from 'next/link';
import { TaskStatus } from '../generated/graphql';

interface Props {
  status?: TaskStatus;
}

const TaskFilter: React.FC<Props> = ({ status }) => {
  return (
    <ul className="task-filter">
      <li>
        <Link href="/">
          <a className={!status ? 'task-filter-active' : ''}>All</a>
        </Link>
      </li>
      <li>
        <Link href="/[status]" as={`/${TaskStatus.Active}`}>
          <a className={status === TaskStatus.Active ? 'task-filter-active' : ''}>Active</a>
        </Link>
      </li>
      <li>
        <Link href="/[status]" as={`/${TaskStatus.Completed}`}>
          <a className={status === TaskStatus.Completed ? 'task-filter-active' : ''}>Completed</a>
        </Link>
      </li>
    </ul>
  );
};

export default TaskFilter;