"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Monitor, Settings, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ErrorCard } from "@/components/ui/error-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";


export function PCsTab() {
  const [pcs, setPCs] = useState([]);
  const [newPc, setNewPc] = useState({}) as any;
  const [departments, setDepartments] = useState([]);
  const [isPCDialogOpen, setIsPCDialogOpen] = useState(false);
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null) as any;
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isOnline = useNetworkStatus();
  const [selectedPc, setSelectedPc] = useState(null) as any;
  const [isDeletePcDialogOpen, setIsDeletePcDialogOpen] = useState(false);
  const [isUpdatePcDialogOpen, setIsUpdatePcDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchPCs(), fetchDepartments()]);
    } catch (err: any) {
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

  // !TODO
  const openDeletePcDialog = (pc: any) => {
    setSelectedPc(pc);
    setIsDeletePcDialogOpen(true);
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

  const handlePCSubmit = async (e: any) => {
    e.preventDefault();
    setIsPCDialogOpen(false);
    await fetch('/api/pcs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPc)
    });
    await fetchPCs();
  };

  const handleDepartmentSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (isEditing && selectedDepartment) {
        await fetch('/api/departments', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _id: selectedDepartment._id,
            name: departmentName,

          })
        });
      } else {
        await fetch('/api/departments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: departmentName,
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

  const handleDeletePc = async () => {
    try {
      await fetch(`/api/pcs?id=${selectedPc?._id}`, {
        method: 'DELETE'
      });
      await fetchPCs();
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  // !TODO
  const handleUpdatePc =  async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await fetch(`/api/pcs`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPc)
      });
      await fetchPCs();
      setIsUpdatePcDialogOpen(false);
    } catch (error) {
      console.error('Error updating link:', error);
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      await fetch(`/api/departments?id=${selectedDepartment?._id}`, {
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

  const openEditDepartment = (department: any) => {
    setSelectedDepartment(department);
    setDepartmentName(department.name);
    setIsEditing(true);
    setIsDepartmentDialogOpen(true);
  };

  const openEditPcDialog = (pc: any) => {
    setNewPc(pc);
    setIsUpdatePcDialogOpen(true);
  }

  const openDeleteDepartment = (department: any) => {
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
      <div className="flex justify-between items-center mb-6 ">
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
                    {departments.map((department: any) => (
                      <div key={department._id} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                        <span>{department.name}</span>
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
                  <Input id="name" required value={newPc.name} onChange={(e) => setNewPc({ ...newPc, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={newPc.department} onValueChange={(value) => setNewPc({ ...newPc, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department: any) => (
                        <SelectItem key={department._id} value={department._id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* <Input id="department" list="departments" required />
                  <datalist id="departments">
                    {departments.map((dept) => (
                      <option key={dept} value={dept} />
                    ))}
                  </datalist> */}
                </div>
                <Button type="submit" className="w-full">Add PC</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <AlertDialog open={isDeletePcDialogOpen} onOpenChange={setIsDeletePcDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this Pc.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePc}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
          {pcs.map((pc: any) => (
            <Card key={pc._id}>
              <CardHeader className="flex-row items-center justify-between gap-4">
                <CardTitle className="flex items-center">
                  <Monitor className="mr-2 h-5 w-5" />
                  {pc.name}
                </CardTitle>
                <div className="flex items-center gap-4">
                  <Dialog open={isUpdatePcDialogOpen} onOpenChange={setIsUpdatePcDialogOpen}>
                    <DialogTrigger asChild>
                      <Edit className="h-4 w-4 cursor-pointer" onClick={() => openEditPcDialog(pc)} />

                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Link</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleUpdatePc} className="space-y-4">
                        <div>
                          <Label htmlFor="name">PC Name</Label>
                          <Input id="name" required value={newPc.name} onChange={(e) => setNewPc({ ...newPc, name: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Select value={newPc?.department?._id} onValueChange={(value) => setNewPc({ ...newPc, department: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((department: any) => (
                                <SelectItem key={department._id} value={department._id}>
                                  {department.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select></div>
                        <Button type="submit" className="w-full">Update Pc</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Trash className="h-4 w-4 cursor-pointer" onClick={() => openDeletePcDialog(pc)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Department: {pc.department.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>}
    </div>
  );
}