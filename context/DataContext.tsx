
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TopProblem } from '../types';
import { topProblemsData as defaultData } from '../services/mockData';

interface DataContextType {
  topProblems: TopProblem[];
  updateData: (data: TopProblem[]) => void;
  resetData: () => void;
  clearData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topProblems, setTopProblems] = useState<TopProblem[]>(defaultData);

  const updateData = (data: TopProblem[]) => {
    setTopProblems(data);
  };

  const resetData = () => {
    setTopProblems(defaultData);
  };

  const clearData = () => {
    setTopProblems([]);
  };

  return (
    <DataContext.Provider value={{ topProblems, updateData, resetData, clearData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
