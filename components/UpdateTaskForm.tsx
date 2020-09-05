import React, { useState, useEffect } from "react";
import { useUpdateTaskMutation } from "../generated/graphql";
import { useRouter } from "next/router";

interface Values {
  id: number;
  title: string;
}

interface Props {
  initialValues: Values;
}

const UpdateTaskForm: React.FC<Props> = ({ initialValues }) => {
  const [values, setValues] = useState<Values>(initialValues);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(values => ({
      ...values,
      [name]: value
    })); 
  }

  const [updateTask, { loading, error, data }] = useUpdateTaskMutation();
  const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateTask({
      variables: {
        input: values
      }
    })
  };

  const router = useRouter();

  useEffect(() => {
    if (data && data.updateTask) {
      router.push('/');
    }
  }, [data]);

  return (
    <form onSubmit={handlerSubmit}>
      {error && <p>An error occurred.</p>}
      <p>
        <label className="field-label">Title</label>
        <input
          type="text"
          name="title"
          value={values.title}
          className="text-input"
          onChange={handlerChange}
        />
      </p>
      <p>
        <button disabled={loading} type="submit" className="button">
          {loading ? 'Loading...': 'Save'}
        </button>
      </p>
    </form>
  );
};

export default UpdateTaskForm;
