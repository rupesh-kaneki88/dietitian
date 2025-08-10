
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Dish from '@/models/Dish';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { id } = await params;
    const { name, recipe } = await req.json();

    const updatedDish = await Dish.findByIdAndUpdate(id, { name, recipe }, { new: true, runValidators: true });

    if (!updatedDish) {
      console.log('Dish not found for update:', id);
      return NextResponse.json({ success: false, message: 'Dish not found' }, { status: 404 });
    }

    console.log('Updated dish:', updatedDish.name);
    return NextResponse.json({ success: true, data: updatedDish });
  } catch (error) {
    console.error('Error updating dish:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { id } = await params;

    const deletedDish = await Dish.findByIdAndDelete(id);

    if (!deletedDish) {
      console.log('Dish not found for deletion:', id);
      return NextResponse.json({ success: false, message: 'Dish not found' }, { status: 404 });
    }

    console.log('Deleted dish:', deletedDish.name);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting dish:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
