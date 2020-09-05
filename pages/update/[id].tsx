import React from "react";
import { NextPage } from "next";
import { withApollo } from "../../lib/apollo";
import { useRouter } from "next/router";
import { useTaskQuery } from "../../generated/graphql";
import UpdateTaskForm from "../../components/UpdateTaskForm";

const UpdatePage: NextPage = () => {
  const route = useRouter();
  // const { id } = route.query;
  const id =
    typeof route.query.id === "string" ? parseInt(route.query.id, 10) : NaN;

  const { loading, error, data } = useTaskQuery({
    variables: {
      id,
    },
  });

  const task = data?.task;
  if (loading) {
    return <p>Loading....</p>;
  }

  if (error) {
    return <p>An error occured</p>;
  }

  return task ? (
    <UpdateTaskForm initialValues={{ id: task.id, title: task.title }} />
  ) : (
    <p>Task not found</p>
  );
};

export default withApollo(UpdatePage);
