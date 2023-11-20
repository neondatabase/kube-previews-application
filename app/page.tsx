import { prisma } from '~/lib/prisma';

export const dynamic = 'force-dynamic';

async function getData () {
  const elements = await prisma.element.findMany();

  return elements
}

export default async function Home () {
  const elements = await getData()
  const HOSTNAME = process.env.HOSTNAME
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
      <ul className="grid grid-cols-2 md:grid-cols-5 gap-5">
        {elements.map((element:any) => (
          <li
            key={element.id}
            className="relative flex flex-col text-center p-5 rounded-md bg-[#00E699] transition-colors hover:bg-[#00e5BF] text-[black]"
          >
            <p className="absolute top-2 left-2 text-sm">
              {element.atomicNumber}
            </p>
            <h2 className="text-2xl font-medium">{element.symbol}</h2>
            <p className="text-base">{element.elementName}</p>
          </li>
        ))}
        <p>{HOSTNAME}</p>
      </ul>
    </main>
  );
}
