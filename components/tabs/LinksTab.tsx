"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ErrorCard } from "@/components/ui/error-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useToast } from "@/hooks/use-toast";
import { generateThumbnailAsUri } from "@/lib/utils";
import getSiteImage from "@/lib/generatelogo";

export function LinksTab() {
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isOnline = useNetworkStatus();
  const [newLink, setNewLink] = useState({ name: '', url: '', category: '', description: '', thumbnail: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  /**
 * Generate a thumbnail URL for an image using Cloudinary.
 * @param {string} imageUrl - The original image URL.
 * @param {number} width - Desired thumbnail width.
 * @param {number} height - Desired thumbnail height.
 * @returns {string} - The transformed thumbnail URL.
 */
  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchLinks(), fetchCategories()]);
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

  const fetchLinks = async () => {
    const response = await fetch('/api/links');
    if (!response.ok) throw new Error('Failed to fetch links');
    const data = await response.json();
    setLinks(data);
  };

  const fetchCategories = async () => {
    const response = await fetch('/api/categories?type=link');
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    setCategories(data);
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    setIsLinkDialogOpen(false);
    const thumbnail = getFavicon(newLink.url);
    await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newLink, thumbnail })
    });
    await fetchLinks();
  };


  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing && selectedCategory) {
        await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _id: selectedCategory._id,
            name: categoryName,
            type: 'link'
          })
        });
      } else {
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: categoryName,
            type: 'link'
          })
        });
      }

      setIsCategoryDialogOpen(false);
      setCategoryName("");
      setIsEditing(false);
      setSelectedCategory(null);
      await fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await fetch(`/api/categories?id=${selectedCategory._id}`, {
        method: 'DELETE'
      });
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
      await fetchCategories();
      await fetchLinks();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const openEditCategory = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setIsEditing(true);
    setIsCategoryDialogOpen(true);
  };

  const openDeleteCategory = (category) => {
    setSelectedCategory(category);
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
        message="There was a problem loading the links. Please try again."
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
        <h2 className="text-2xl font-semibold">Links Management</h2>
        <div className="flex gap-2">
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Manage Categories
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {isEditing ? 'Update Category' : 'Add Category'}
                </Button>
              </form>
              {categories.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Existing Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category._id} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                        <span>{category.name}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteCategory(category)}
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

          <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Link</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleLinkSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required value={newLink.name} onChange={(e) => setNewLink({ ...newLink, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input id="url" type="url" required
                    value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" required
                    value={newLink.description} onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newLink.category} onValueChange={(value) => setNewLink({ ...newLink, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Add Link</Button>
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
              This will permanently delete the category and all associated links.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {
        links.length === 0 ?
          <EmptyState
            title="No Links Found"
            message="Get started by adding your first link."
            action={() => setIsLinkDialogOpen(true)}
            actionLabel="Add Link"
          />

          :


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <Card key={link._id}>
                <CardHeader className="flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">

                  <img
                    src={link.thumbnail}
                    alt={link.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <CardTitle>{link.name}</CardTitle>
                  </div>
                   <Edit className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{link.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                      {link.category.name}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        Visit
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>}
    </div>
  );
}