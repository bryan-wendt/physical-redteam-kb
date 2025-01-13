import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Red Team Wiki',
    <img src='../static/img/red_team.png' />,
    description: (
      <>
        Physical Red Team Wiki that covers a large 
        number of topics pertaining to physical security.
      </>
    ),
  },
  {
    title: 'Blog',
    description: (
      <img src='../static/img/blog_new.png' />,
      <>
        Blog covers a wide range of topics regarding security, certifications,
        training, and personal endeavors.
      </>
    ),
  }
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--2')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
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
