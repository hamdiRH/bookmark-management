"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Circle, Clock, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorCard } from "@/components/ui/error-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useToast } from "@/hooks/use-toast";

export function TodoTab() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '', status: 'pending', priority: 'medium', dueDate: '' });
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isOnline = useNetworkStatus();
  const { toast } = useToast();


  const createParticles = (x: number, y: number) => {
    const colors = ['#8B5CF6', '#D946EF', '#F97316'];
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = '8px';
      particle.style.height = '8px';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = '50%';
      container.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const velocity = 8 + Math.random() * 6;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      let posX = x;
      let posY = y;

      const animate = () => {
        posX += vx;
        posY += vy + 0.5; // Add gravity

        particle.style.transform = `translate(${posX - x}px, ${posY - y}px)`;
        particle.style.opacity = '1';

        if (posY < window.innerHeight) {
          requestAnimationFrame(animate);
        } else {
          //   container.removeChild(particle);
          if (container.children.length === 0) {
            //  document.body.removeChild(container);
          }
        }
      };

      setTimeout(() => {
        animate();
        setTimeout(() => {
          if (particle.parentNode === container) {
            container.removeChild(particle);
            if (container.children.length === 0) {
              document.body.removeChild(container);
            }
          }
        }, 1000);
      }, Math.random() * 100);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchTodos();
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Error",
        description: "Failed to load todos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTodos = async () => {
    const response = await fetch('/api/todos');
    if (!response.ok) throw new Error('Failed to fetch todos');
    const data = await response.json();
    setTodos(data);
  };

  const handleDeleteTodo = async (id: string) => {
    await fetch(`/api/todos?id=${id}`, {
      method: 'DELETE',
    });
    await fetchTodos();
  };

  const toggleTodoStatus = async (todo: any, event: any) => {
    event.stopPropagation();
    await fetch(`/api/todos`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...todo, status: todo.status === 'completed' ? 'pending' : 'completed' }),
    });
    await fetchTodos();
    if (todo.status !== 'completed') {

      const rect = event.target.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      createParticles(x, y);

      const checkmark = event.target.querySelector('.checkmark');
      if (checkmark) {
        checkmark.classList.add('celebration');
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    });

    setIsOpen(false);
    await fetchTodos();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOnline) {
    return (
      <ErrorCard
        title="No Internet Connection"
        message="Please check your internet connection and try again."
        isOffline
        retry={fetchData}
      />
    );
  }

  if (error) {
    return (
      <ErrorCard
        title="Error Loading Data"
        message="There was a problem loading the todos. Please try again."
        retry={fetchData}
      />
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Todo List</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Todo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Todo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" required value={newTodo.title} onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={newTodo.description} onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select onValueChange={(value) => setNewTodo({ ...newTodo, priority: value })} value={newTodo.priority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" value={newTodo.dueDate} onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">Add Todo</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {
        todos.length === 0 ? (<EmptyState
          title="No Todos Found"
          message="Get started by adding your first todo."
          action={() => setIsOpen(true)}
          actionLabel="Add Todo"
        />)
          :

          <div className="space-y-4">
            {todos.map((todo: any) => (
              <Card key={todo._id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between cursor-pointer ">
                    <button className="flex items-center" onClick={(e) => toggleTodoStatus(todo, e)}>
                      {getStatusIcon(todo.status)}
                      <span className="ml-2" >{todo.title}</span>
                    </button>
                    <span className={`text-sm px-2 py-1 rounded ${getPriorityColor(todo.priority)}`}>
                      {todo.priority}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{todo.description}</p>
                  {todo.dueDate && (
                    <p className="text-sm text-gray-500">
                      Due: {new Date(todo.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex justify-end">

                    <Trash className="w-4 h-4 text-red-600 cursor-pointer" onClick={() => handleDeleteTodo(todo._id)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>}
    </div>
  );
}