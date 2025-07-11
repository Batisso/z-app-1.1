import { db } from '../db';
import { creators, works } from '../db/schema';
import creatorsData from '../data/creators.json';

async function migrateData() {
  console.log('Starting migration...');

  for (const creator of creatorsData.creatorProfiles) {
    // Insert creator
    await db.insert(creators).values({
      id: creator.id,
      fullName: creator.fullName,
      slug: creator.slug,
      discipline: creator.discipline,
      countryOfOrigin: creator.countryOfOrigin,
      basedIn: creator.basedIn,
      bio: creator.bio.raw,
      profilePhotoUrl: creator.profilePhoto.url,
      socialLinks: JSON.stringify(creator.socialLinks),
      styleTags: JSON.stringify(creator.styleTags),
    });

    // Insert works
    for (const work of creator.works) {
      await db.insert(works).values({
        id: work.id,
        creatorId: creator.id,
        url: work.url,
      });
    }
  }

  console.log('Migration completed successfully!');
}

migrateData().catch(console.error); 