'use client';

export default function Error({ error }: { error: Error }) {
    return <div style={{ color: 'red' }}>{error.message}</div>
}