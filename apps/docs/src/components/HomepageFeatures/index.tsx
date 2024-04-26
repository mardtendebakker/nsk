import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Welcome to NSK',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Where we will be introducing you nexxus.
      </>
    ),
  },
  {
    title: 'NSK stands for Nexxus Stock Keeping',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
      Nexxus Stock Keeping (Nexxus) is a webapplication made for purchase, sale and keeping of any stock for any type of business.
      </>
    ),
  },
  {
    title: 'Team of diversity',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
       We are working on this application with an international team of 2 full stack developers and a UI/UX designer from Iran, Morocco and India.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
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

export default function HomepageFeatures(): JSX.Element {
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
