import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Red Team Wiki',
    titleLink: '/docs/intro',
    imageLink: '/img/red_team.png',
    description: (
      <>
        Physical Red Team Wiki that covers a large 
        number of topics pertaining to physical security.
      </>
    ),
  },
  {
    title: 'Blog',
    titleLink: '/blog',
    imageLink: '/img/blog_new.png',
    description: (
      <>
        Blog covers a wide range of topics regarding security, certifications,
        training, and personal endeavors.
      </>
    ),
  }
];

function Feature({title, description, imageLink, titleLink}) {
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center">
        <img src={imageLink} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3"><a href={titleLink}>{title}</a></Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
