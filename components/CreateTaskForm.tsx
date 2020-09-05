import { fchmod } from "fs";

import React, { useState } from "react";
import { useCreateTaskMutation } from "../generated/graphql";

interface Props {
  onTaskCreated: () => void;
}

const CreateTaskForm: React.FC<Props> = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [createTask, { loading, error }] = useCreateTaskMutation({
    onCompleted: () => {
      onTaskCreated();
      setTitle('');
    }
  });
  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loading && title) {
      createTask({
        variables: {
          input: {
            title,
          },
        },
      });
    }
  };

  return (
    <form onSubmit={handlerSubmit}>
      {error && <p className="alert-error">An error occured.</p>}
      <input
        type="test"
        name="title"
        placeholder="What would you like to get done?"
        autoComplete="off"
        className="text-input new-task-text-input"
        value={title}
        onChange={handlerChange}
      />
    </form>
  );
};

export default CreateTaskForm;
