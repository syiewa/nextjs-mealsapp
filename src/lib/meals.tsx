import slugify from 'slugify';
import xss from 'xss';
import fs from 'node:fs';
import { S3 } from '@aws-sdk/client-s3';
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClient } from '@/utils/supabase/client';


const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  region: process.env.AWS_REGION || '',
});

const supabase = createClient();
export async function getMeals() {
  const {data:meals} = await supabase.from('meals').select('*');
  return meals;
};

export async function getMeal(slug: string) {
  const { data: meal } = await supabase.from('meals').select('*').eq('slug', slug).single();
  return meal;
}
export async function getImageS3(filename: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: filename,
    });

    const url = await getSignedUrl(s3, command);
    return url;
    //return new NextResponse(url)
  } catch (error) {
    console.error('Error fetching image from S3:', error);
    return new Response('Error fetching image from S3');
  }
}

export async function saveMeal(meal: {
  title: string;
  summary: string;
  instructions: string;
  image: File;
  creator: string;
  creator_email: string;
}) {
  const slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split('.').pop();
  const filename = `${slug}.${extension}`;
  const stream = fs.createWriteStream(`public/images/${filename}`);
  const bufferedImage = await meal.image.arrayBuffer();

  stream.write(Buffer.from(bufferedImage),(error) => {
    if(error){
      throw new Error('Error saving image');
    }
  });

  try {
    await s3.putObject({
      Bucket: 'nextjs-training',
      Key: filename,
      Body: Buffer.from(bufferedImage),
      ContentType: meal.image.type,
    });
  } catch (error) {
    console.log(error);
    throw new Error('Error uploading image to S3');
  }

  stream.end();
  //const image = `/images/${filename}`;
  const { error } = await supabase
  .from('meals')
  .insert({ slug: slug, title: meal.title, summary: meal.summary, instructions: meal.instructions, image: filename, creator: meal.creator, creator_email: meal.creator_email });
  console.log(error);
}