import React from "react";
import { NextPage } from "next";
import { withApollo } from "../lib/apollo";
import { useTasksQuery, TaskStatus } from "../generated/graphql";
import TaskList from "../components/TaskList";
import CreateTaskForm from "../components/CreateTaskForm";

interface InitialProps {}

interface Props extends InitialProps {}

const IndexPage: NextPage<Props, InitialProps> = (props) => {
  const { loading, error, data, refetch } = useTasksQuery({
    variables: { status: TaskStatus.Active },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>An error occurred.</p>;
  }

  const tasks = data?.tasks;
  return (
    <>
      <CreateTaskForm onTaskCreated={refetch} />
      {tasks && tasks.length ? (
        <TaskList tasks={tasks} />
      ) : (
        <p className="no-tasks-message">There are no tasks here.</p>
      )}
    </>
  );
};

const IndexPageWithApollo = withApollo(IndexPage);

export default IndexPageWithApollo;
