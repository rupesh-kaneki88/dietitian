
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Menu from '@/models/Menu';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const url = new URL(req.url);
    const clientId = url.searchParams.get('client');

    let query = {};
    if (clientId) {
      query = { client: clientId };
    }

    const menus = await Menu.find(query).populate('client').populate('dishes');
    console.log('Fetched menus:', menus.length);
    return NextResponse.json({ success: true, data: menus });
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { client, dishes } = await req.json();
    const newMenu = new Menu({ client, dishes });
    await newMenu.save();
    console.log('Created new menu for client:', client);
    return NextResponse.json({ success: true, data: newMenu }, { status: 201 });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
