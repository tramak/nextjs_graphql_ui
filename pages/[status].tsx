import React from "react";
import { NextPage } from "next";
import { withApollo } from "../lib/apollo";
import { useTasksQuery, TaskStatus } from "../generated/graphql";
import TaskList from "../components/TaskList";
import CreateTaskForm from "../components/CreateTaskForm";
import { useRouter } from 'next/router';
import TaskFilter from '../components/TaskFilter';

interface InitialProps {
  ssr: boolean;
}

interface Props extends InitialProps {}

const IndexPage: NextPage<Props, InitialProps> = ({ ssr }) => {
  const router = useRouter();
  const status = typeof router.query.status === 'string'
    ? router.query.status as TaskStatus
    : undefined;
  const { loading, error, data, refetch } = useTasksQuery({
    variables: { status },
    fetchPolicy: ssr ? 'cache-first' : 'cache-and-network'
  });

  const tasks = data?.tasks;
  if (loading && !tasks) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>An error occurred.</p>;
  }

  return (
    <>
      <CreateTaskForm onTaskCreated={refetch} />
      {tasks && tasks.length ? (
        <TaskList status={status} tasks={tasks} />
      ) : (
        <p className="no-tasks-message">There are no tasks here.</p>
      )}
      <TaskFilter status={status} />
    </>
  );
};

IndexPage.getInitialProps = async (ctx) => {
  return {
    ssr: !!ctx.req
  };
};

const IndexPageWithApollo = withApollo(IndexPage);

export default IndexPageWithApollo;
