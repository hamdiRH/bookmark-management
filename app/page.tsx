"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinksTab } from "@/components/tabs/LinksTab";
import { PCsTab } from "@/components/tabs/PCsTab";
import { TodoTab } from "@/components/tabs/TodoTab";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useStorage } from "@/contexts/storage-context";

export default function Home() {
  const { storageType, setStorageType } = useStorage();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-center items-center mb-8">
        <h1 className="text-4xl font-bold">Management Tools</h1>
        {/* <div className="flex items-center space-x-2">
          <Switch
            id="storage-toggle"
            checked={storageType === 'json'}
            onCheckedChange={(checked) => {
              const newType = checked ? 'json' : 'mongodb';
              setStorageType(newType);
            }}
          />
          <Label htmlFor="storage-toggle">
            {storageType === 'json' ? 'Local Storage' : 'MongoDB'}
          </Label>
        </div> */}
      </div>
      
      <Tabs defaultValue="links" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="pcs">PCs</TabsTrigger>
          <TabsTrigger value="todo">Todo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="links">
          <LinksTab />
        </TabsContent>
        
        <TabsContent value="pcs">
          <PCsTab />
        </TabsContent>
        
        <TabsContent value="todo">
          <TodoTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}