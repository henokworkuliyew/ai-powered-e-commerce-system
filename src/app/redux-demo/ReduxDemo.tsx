'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  increment,
  decrement,
  incrementByAmount,
  reset,
} from '@/store/slices/counterSlice';
import {
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
  clearTodos,
  Todo,
} from '@/store/slices/todoSlice';

export default function ReduxDemo() {
  const dispatch = useAppDispatch();
  const counter = useAppSelector((state) => state.counter);
  const todos = useAppSelector((state) => state.todos);

  const [todoText, setTodoText] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editText, setEditText] = useState('');

  const handleAddTodo = () => {
    if (todoText.trim()) {
      dispatch(addTodo({ text: todoText.trim(), completed: false }));
      setTodoText('');
    }
  };

  const handleToggleTodo = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const handleDeleteTodo = (id: string) => {
    dispatch(deleteTodo(id));
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setEditText(todo.text);
  };

  const handleSaveEdit = () => {
    if (editingTodo && editText.trim()) {
      dispatch(updateTodo({ id: editingTodo.id, text: editText.trim() }));
      setEditingTodo(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setEditText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Counter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Counter Example</h2>
        <div className="text-center">
          <div className="text-6xl font-bold text-blue-600 mb-4">
            {counter.value}
          </div>
          <div className="space-x-2 mb-4">
            <button
              onClick={() => dispatch(decrement())}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              -
            </button>
            <button
              onClick={() => dispatch(increment())}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              +
            </button>
          </div>
          <div className="space-x-2 mb-4">
            <button
              onClick={() => dispatch(incrementByAmount(5))}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              +5
            </button>
            <button
              onClick={() => dispatch(incrementByAmount(10))}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            >
              +10
            </button>
          </div>
          <button
            onClick={() => dispatch(reset())}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
          {counter.isLoading && (
            <div className="mt-2 text-gray-600">Loading...</div>
          )}
        </div>
      </div>

      {/* Todo Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Todo Example</h2>
        
        {/* Add Todo Form */}
        <div className="flex mb-4">
          <input
            type="text"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <button
            onClick={handleAddTodo}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {todos.todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center justify-between p-3 border rounded ${
                todo.completed ? 'bg-gray-100' : 'bg-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                  className="w-4 h-4 text-blue-600"
                />
                {editingTodo?.id === todo.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                  />
                ) : (
                  <span
                    className={`${
                      todo.completed ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {todo.text}
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                {editingTodo?.id === todo.id ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStartEdit(todo)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Todo Actions */}
        {todos.todos.length > 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => dispatch(clearTodos())}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Todo Stats */}
        <div className="mt-4 text-center text-sm text-gray-600">
          {todos.todos.length === 0 ? (
            <p>No todos yet. Add one above!</p>
          ) : (
            <p>
              {todos.todos.filter(t => t.completed).length} of {todos.todos.length} completed
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


