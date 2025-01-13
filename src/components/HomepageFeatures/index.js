import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Red Team Wiki',
    imageLink: '../static/img/red_team.png',
    description: (
      <>
        Physical Red Team Wiki that covers a large 
        number of topics pertaining to physical security.
      </>
    ),
  },
  {
    title: 'Blog',
    imageLink: '../static/img/blog_new.png',
    description: (
      <>
        Blog covers a wide range of topics regarding security, certifications,
        training, and personal endeavors.
      </>
    ),
  }
];

function Feature({Svg, title, description, imageLink}) {
  return (
    <div className={clsx('col col--2')}>
      <div className="text--center">
        <img src={imageLink} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
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
