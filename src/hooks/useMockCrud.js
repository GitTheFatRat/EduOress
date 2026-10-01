import { useState, useEffect } from 'react';
import { getItem, setItem } from '../lib/storage';

export const useMockCrud = (key, initialData = []) => {
  const [data, setData] = useState([]);

    useEffect(() => {
    const stored = getItem(key);
    if (stored) setData(stored);
    else {
      setItem(key, initialData);
      setData(initialData);
    }
  }, [key]);

  const add = (item) => {
    const newData = [...data, item];
    setData(newData);
    setItem(key, newData);
  };

  return { data, add };
};
