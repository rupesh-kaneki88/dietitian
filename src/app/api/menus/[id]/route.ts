
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Menu from '@/models/Menu';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await dbConnect();

  try {
    const { client, dishes } = await req.json();

    const updatedMenu = await Menu.findByIdAndUpdate(id, { client, dishes }, { new: true, runValidators: true });

    if (!updatedMenu) {
      console.log('Menu not found for update:', id);
      return NextResponse.json({ success: false, message: 'Menu not found' }, { status: 404 });
    }

    console.log('Updated menu:', updatedMenu._id);
    return NextResponse.json({ success: true, data: updatedMenu });
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await dbConnect();

  try {
    const deletedMenu = await Menu.findByIdAndDelete(id);

    if (!deletedMenu) {
      console.log('Menu not found for deletion:', id);
      return NextResponse.json({ success: false, message: 'Menu not found' }, { status: 404 });
    }

    console.log('Deleted menu:', deletedMenu._id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
