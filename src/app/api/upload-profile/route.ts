import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('profilePicture') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `profile-${uniqueSuffix}.${file.name.split('.').pop()}`;
    
    // Save the file to the public directory
    const publicDir = join(process.cwd(), 'public', 'profiles');
    const filepath = join(publicDir, filename);
    
    await writeFile(filepath, buffer);

    // Return the file path that can be used to access the image
    return NextResponse.json({ 
      success: true,
      filepath: `/profiles/${filename}`
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
} 