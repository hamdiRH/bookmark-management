"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Monitor, Settings, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ErrorCard } from "@/components/ui/error-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useToast } from "@/hooks/use-toast";

export function PCsTab() {
  const [pcs, setPCs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isPCDialogOpen, setIsPCDialogOpen] = useState(false);
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isOnline = useNetworkStatus();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchPCs(), fetchDepartments()]);
    } catch (err) {
      setError(err);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPCs = async () => {
    const response = await fetch('/api/pcs');
    if (!response.ok) throw new Error('Failed to fetch PCs');
    const data = await response.json();
    setPCs(data);
  };

  const fetchDepartments = async () => {
    const response = await fetch('/api/departments');
    if (!response.ok) throw new Error('Failed to fetch departments');
    const data = await response.json();
    setDepartments(data);
  };

  const handlePCSubmit = async (e) => {
    e.preventDefault();
    setIsPCDialogOpen(false);
    await fetchPCs();
  };

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing && selectedDepartment) {
        await fetch('/api/departments', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            oldName: selectedDepartment,
            newName: departmentName
          })
        });
      }

      setIsDepartmentDialogOpen(false);
      setDepartmentName("");
      setIsEditing(false);
      setSelectedDepartment(null);
      await fetchDepartments();
      await fetchPCs();
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      await fetch(`/api/departments?name=${selectedDepartment}`, {
        method: 'DELETE'
      });
      setIsDeleteDialogOpen(false);
      setSelectedDepartment(null);
      await fetchDepartments();
      await fetchPCs();
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const openEditDepartment = (department) => {
    setSelectedDepartment(department);
    setDepartmentName(department);
    setIsEditing(true);
    setIsDepartmentDialogOpen(true);
  };

  const openDeleteDepartment = (department) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
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
        message="There was a problem loading the PCs. Please try again."
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
        <h2 className="text-2xl font-semibold">PC Management</h2>
        <div className="flex gap-2">
          <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Manage Departments
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Department' : 'Add New Department'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleDepartmentSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="departmentName">Department Name</Label>
                  <Input
                    id="departmentName"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {isEditing ? 'Update Department' : 'Add Department'}
                </Button>
              </form>
              {departments.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Existing Departments</h3>
                  <div className="space-y-2">
                    {departments.map((department) => (
                      <div key={department} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                        <span>{department}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDepartment(department)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDepartment(department)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={isPCDialogOpen} onOpenChange={setIsPCDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add PC
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New PC</DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePCSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">PC Name</Label>
                  <Input id="name" required />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" list="departments" required />
                  <datalist id="departments">
                    {departments.map((dept) => (
                      <option key={dept} value={dept} />
                    ))}
                  </datalist>
                </div>
                <Button type="submit" className="w-full">Add PC</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the department and all associated PCs.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDepartment}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {pcs.length === 0 ?
        <EmptyState
          title="No PCs Found"
          message="Get started by adding your first PC."
          action={() => setIsPCDialogOpen(true)}
          actionLabel="Add PC"
        />
        :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pcs.map((pc) => (
            <Card key={pc._id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="mr-2 h-5 w-5" />
                  {pc.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Department: {pc.department}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>}
    </div>
  );
}