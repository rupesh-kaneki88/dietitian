
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Client from '@/models/Client';
import Dish from '@/models/Dish';
import Menu from '@/models/Menu';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const clientCount = await Client.countDocuments();
    const dishCount = await Dish.countDocuments();
    const menuCount = await Menu.countDocuments();

    console.log('Fetched stats: Clients -', clientCount, ', Dishes -', dishCount, ', Menus -', menuCount);
    return NextResponse.json({
      success: true,
      data: {
        clientCount,
        dishCount,
        menuCount,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
