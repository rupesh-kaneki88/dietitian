
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Dish from '@/models/Dish';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const dishes = await Dish.find({});
    console.log('Fetched dishes:', dishes.length);
    return NextResponse.json({ success: true, data: dishes });
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { name, recipe } = await req.json();
    const newDish = new Dish({ name, recipe });
    await newDish.save();
    console.log('Created new dish:', newDish.name);
    return NextResponse.json({ success: true, data: newDish }, { status: 201 });
  } catch (error) {
    console.error('Error creating dish:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
