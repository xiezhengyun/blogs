import { useState, useMemo, useCallback } from 'react';

const useForm = (initialValues = {}, validators) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const setFieldValue = useCallback(
    (name, value) => {
      setValues(values => ({
        ...values,
        [name]: value,
      }));

      if (validators[name]) {
        const errMsg = validators[name](value);
        setErrors(errors => ({
          ...errors,
          [name]: errMsg || null,
        }));
      }
    },
    [validators]
  );

  return { values, errors, setFieldValue };
};

export default () => {
  // 用 useMemo 缓存 validators 对象
  const validators = useMemo(() => {
    return {
      name: value => {
        if (value.length < 2) return 'Name length should be no less than 2.';
        return null;
      },
      email: value => {
        if (!value.includes('@')) return 'Invalid email address';
        return null;
      },
    };
  }, []);
  const { values, errors, setFieldValue } = useForm({}, validators);
  const handleSubmit = useCallback(
    evt => {
      evt.preventDefault();
      console.log(values);
    },
    [values]
  );
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name: </label>
        <input value={values.name || null} onChange={evt => setFieldValue('name', evt.target.value)} />
        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
      </div>

      <div>
        <label>Email:</label>
        <input value={values.email || null} onChange={evt => setFieldValue('email', evt.target.value)} />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
