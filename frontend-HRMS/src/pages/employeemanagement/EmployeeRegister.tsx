import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Tabs, } from 'radix-ui'
import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ChevronDown, Plus } from "lucide-react";

function EmployeeRegister() {
  const [open, setOpen] = React.useState(false);
  const [bloodGroup, setBloodGroup] = React.useState("");

  return (
    <SidebarProvider>
      <AppSidebar />

      <main className='flex-1 p-6'>
        <div className='flex items-center justify-between mb-6'>
          <SidebarTrigger />
          <h1 className="text-2xl font-light mb-6 "> Employee Register</h1>

        </div>
        {/* Tabs Container */}
        <div className="bg-white rounded-2xl shadow p-4 ">
          <Tabs.Root defaultValue="tab1" className="w-full">
            <Tabs.List className="flex w-fit max-w-full mx-auto  overflow-x-auto no-scrollbar bg-gray-100 rounded-xl p-1 gap-2 " aria-label='manage your account'>
              <Tabs.Trigger value="tab1" className=' cursor-pointer px-4 py-1 rounded-lg text-xs transition  data-[state=active]:bg-gray-200 '>Personal Details</Tabs.Trigger>
              <Tabs.Trigger value="tab2" className=' cursor-pointer px-4 py-1 rounded-lg text-xs transition  data-[state=active]:bg-gray-200 '>Professional Details</Tabs.Trigger>
              <Tabs.Trigger value="tab3" className=' cursor-pointer px-4 py-1 rounded-lg text-xs transition  data-[state=active]:bg-gray-200 '>Contect & Address</Tabs.Trigger>
            </Tabs.List>

            {/* Tab 1 */}
            <Tabs.Content value="tab1" className="mt-2">
              <form className="space-y-5 p-6">

                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1 block">First Name*</Label>
                    <Input type="text" placeholder="First Name" />
                  </div>

                  <div>
                    <Label className="mb-1 block">Last Name*</Label>
                    <Input type="text" placeholder="Last Name" />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1 block">Email Address*</Label>
                    <Input type="email" placeholder="Email" />
                  </div>

                  <div>
                    <Label className="mb-1 block">Phone Number*</Label>
                    <Input type="tel" placeholder="+91 XXXXXXXXXX" />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* selsect blood group */}
                  <div className="space-y-1">
                    <Label className="mb-1 block">Blood Group</Label>

                    <Select.Root open={open} onOpenChange={setOpen} value={bloodGroup} onValueChange={setBloodGroup}>
                      <Select.Trigger
                        className="w-full flex items-center justify-between rounded-lg border px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <Select.Value placeholder="Select Blood Group" />
                        {/*  Ye dropdown icon hai */}
                        <ChevronDown className={`w-4 h-4 opacity-50 ${open && "rotate-180"}`} />
                      </Select.Trigger>

                      {/* Ye blood group hai */}
                      <Select.Content position="popper" className="bg-white rounded-lg shadow-md border p-1 " >
                        <Select.Group>
                          <Select.Item value="A+" className="px-3 py-2 rounded-md hover:bg-gray-100"><Select.ItemText>A+</Select.ItemText></Select.Item>
                          <Select.Item value="A-" className="px-3 py-2 rounded-md hover:bg-gray-100"><Select.ItemText>A-</Select.ItemText></Select.Item>
                          <Select.Item value="B+" className="px-3 py-2 rounded-md hover:bg-gray-100"><Select.ItemText>B+</Select.ItemText></Select.Item>
                          <Select.Item value="B-" className="px-3 py-2 rounded-md hover:bg-gray-100"><Select.ItemText>B-</Select.ItemText></Select.Item>
                          <Select.Item value="O+" className="px-3 py-2 rounded-md hover:bg-gray-100"><Select.ItemText>O+</Select.ItemText></Select.Item>
                          <Select.Item value="O-" className="px-3 py-2 rounded-md hover:bg-gray-100"><Select.ItemText>O-</Select.ItemText></Select.Item>
                          <Select.Item value="AB+" className="px-3 py-2 rounded-md hover:bg-gray-100"><Select.ItemText>AB+</Select.ItemText></Select.Item>
                          <Select.Item value="AB-" className="px-3 py-2 rounded-md hover:bg-gray-100"><Select.ItemText>AB-</Select.ItemText></Select.Item>
                        </Select.Group>
                      </Select.Content>

                    </Select.Root>
                  </div>
                  <div>
                    <Label className='mb-1 block'>Emergency Contact</Label>
                    <Input type="tel" placeholder="+91 XXXXXXXXXX" />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="reset" variant="outline" className=' cursor-pointer'>
                    Cancel
                  </Button>

                  <Button type="submit" variant="outline" className=' cursor-pointer'>
                    <Plus className="w-4 h-4" />
                    Register Employee
                  </Button>
                </div>

              </form>

            </Tabs.Content>
            {/* Tab 2 */}
            <Tabs.Content value="tab2" className="mt-2">Tab 2 Content</Tabs.Content>
            {/* Tab 3 */}
            <Tabs.Content value="tab3" className="mt-2">Tab 3 Content</Tabs.Content>
          </Tabs.Root>
        </div>
      </main>
    </SidebarProvider>
  )
}

export default EmployeeRegister
