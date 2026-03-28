import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

function DepartmentEdit({ open, setOpen, selectedDept, onUpdate, loading }: any) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (selectedDept) {
            setName(selectedDept.name || '');
        }
    }, [selectedDept]);

    return (

        <Dialog open={open} onOpenChange={setOpen}  >
            <DialogContent className='space-y-6 w-96'>
                <DialogHeader>
                    <DialogTitle>Update Department</DialogTitle>
                    <DialogDescription>
                        Update the department name
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onUpdate(name);
                    }}
                >
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Button className="w-full mt-4" type="submit" >
                        {loading && <Spinner />} Update</Button>
                </form>
            </DialogContent>
        </Dialog>

    )
}

export default DepartmentEdit
