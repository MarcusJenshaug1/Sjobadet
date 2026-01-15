'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

export function SubmitButton({ children, ...props }: any) {
    const { pending } = useFormStatus();

    return (
        <Button {...props} type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Lagrer...
                </>
            ) : (
                children
            )}
        </Button>
    );
}
