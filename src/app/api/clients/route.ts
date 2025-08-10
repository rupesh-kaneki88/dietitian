
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Client from '@/models/Client';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const clients = await Client.find({});
    console.log('Fetched clients:', clients.length);
    return NextResponse.json({ success: true, data: clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { name, email } = await req.json();
    const newClient = new Client({ name, email });
    await newClient.save();
    console.log('Created new client:', newClient.name);
    return NextResponse.json({ success: true, data: newClient }, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
