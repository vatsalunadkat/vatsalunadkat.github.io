import { unstable_cache as cache } from 'next/cache';

import { buildBoringAvatarUrl } from '@/utils/boring-avatars';
import { groupBy } from '@/utils/group-by';

import { getBmacData } from './bmac/bmac';
import { getGitHubSponsors } from './github/sponsors';
import { unicorns } from './unicorns';

const categoriesPriceAndKey: Record<number, CategoryKey> = {
  2: 'star',
  5: 'ball',
  10: 'rocket',
  25: 'diamond',
};

const categoriesPriceAndName: Record<number, string> = {
  2: 'Star',
  5: 'Crystal Ball',
  10: 'Rocket',
  25: 'Diamond',
};

const getAllMonthlySponsors = (
  sponsors: Array<ReadableSupporter>,
): Array<SponsorsCategory> => {
  const grouped = groupBy(sponsors, (it) => it.amount);
  return Object.keys(grouped)
    .map((amount) => {
      const sponsors = grouped[Number(amount) as keyof typeof grouped];
      const totalEarningsPerMonth = sponsors.reduce((p, c) => p + c.amount, 0);
      return {
        key: categoriesPriceAndKey[Number(amount)],
        name: categoriesPriceAndName[Number(amount)],
        price: Number(amount),
        totalEarningsPerMonth,
        sponsorsCount: sponsors.length,
        sponsors,
      };
    })
    .sort((a, b) => b.price - a.price);
};

const MIN_AMOUNT_FOR_UNICORN = 75;
export const getSponsorsAndCategories = cache(
  async () => {
    const { members, oneTime: bmacOneTime } = await getBmacData();
    const { sponsors, oneTime: githubOneTime } = await getGitHubSponsors();

    const allMonthly = getAllMonthlySponsors([...members, ...sponsors]);

    const totalEarningsPerMonth = allMonthly.reduce((p, c) => {
      return p + c.totalEarningsPerMonth;
    }, 0);

    const sponsorsCount = allMonthly.reduce((p, c) => {
      return p + c.sponsorsCount;
    }, 0);

    return {
      categories: allMonthly,
      unicorns: [
        ...bmacOneTime.filter((it) => it.amount >= MIN_AMOUNT_FOR_UNICORN),
        ...githubOneTime.filter((it) => it.amount >= MIN_AMOUNT_FOR_UNICORN),
        ...unicorns.map(
          (it) =>
            ({
              ...it,
              photo: it.photo?.includes('unavatar')
                ? `${it.photo}?fallback=${buildBoringAvatarUrl(it.name)}`
                : it.photo,
              amount: 0,
            }) as ReadableSupporter,
        ),
      ],
      totalEarningsPerMonth,
      sponsorsCount,
    };
  },
  ['sponsors'],
  { revalidate: 43200 },
);
