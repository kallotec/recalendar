import { NextResponse, NextRequest } from 'next/server';
import { GetByDate, Delete, Insert, Update } from '@/lib/EventsRepo';

export async function GET(request: NextRequest) {
    const date = request.nextUrl.searchParams.get('date')
    const result = await GetByDate(date as string);
    return NextResponse.json(result, { status: 200 });
}

export async function POST(request: NextRequest) {
    const res = await request.json();
    const [{ id }] = await Insert(res);
    return NextResponse.json({ id }, { status: 201 });
}

export async function PUT(request: NextRequest) {
    const res = await request.json();
    await Update(res);
    return NextResponse.json({ status: 204 });
}

export async function DELETE(request: NextRequest) {
    const id: number = +(request.nextUrl.searchParams.get('id') as string);
    await Delete(id);
    return NextResponse.json({ status: 204 });
}