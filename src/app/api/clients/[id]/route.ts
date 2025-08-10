
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Client from '@/models/Client';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { id } = await params;
    const { name, email } = await req.json();

    const updatedClient = await Client.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true });

    if (!updatedClient) {
      console.log('Client not found for update:', id);
      return NextResponse.json({ success: false, message: 'Client not found' }, { status: 404 });
    }

    console.log('Updated client:', updatedClient.name);
    return NextResponse.json({ success: true, data: updatedClient });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { id } = await params;

    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      console.log('Client not found for deletion:', id);
      return NextResponse.json({ success: false, message: 'Client not found' }, { status: 404 });
    }

    console.log('Deleted client:', deletedClient.name);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
