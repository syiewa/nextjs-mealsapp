import Image from 'next/image';

export default function Header() {
  return (
    <>
            <Image src="/logo.png" width={128} height={128} alt='meaning'></Image>
            <h1>Welcome to this NextJS course</h1>
    </>
  )
}