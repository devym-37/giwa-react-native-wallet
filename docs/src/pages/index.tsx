import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroBackground}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGrid} />
      </div>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeIcon}>🚀</span>
            <Translate id="homepage.hero.badge">React Native SDK for GIWA Chain</Translate>
          </div>
          <h1 className={styles.heroTitle}>
            <Translate id="homepage.hero.title">Build Web3 Mobile Apps</Translate>
            <br />
            <span className={styles.heroTitleGradient}>
              <Translate id="homepage.hero.titleHighlight">with GIWA SDK</Translate>
            </span>
          </h1>
          <p className={styles.heroSubtitle}>
            <Translate id="homepage.hero.subtitle">
              The easiest way to integrate blockchain wallet functionality into your React Native apps.
              Supports Expo and React Native CLI with secure storage and biometric authentication.
            </Translate>
          </p>
          <div className={styles.heroButtons}>
            <Link className={styles.primaryButton} to="/docs">
              <Translate id="homepage.getStarted">Get Started</Translate>
              <span className={styles.buttonIcon}>→</span>
            </Link>
            <Link
              className={styles.secondaryButton}
              to="https://github.com/dev-eyoungmin/giwa-react-native-wallet"
            >
              <span className={styles.githubIcon}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </span>
              GitHub
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>~200ms</span>
              <span className={styles.statLabel}>
                <Translate id="homepage.stats.confirmation">Preconfirmation</Translate>
              </span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>10+</span>
              <span className={styles.statLabel}>
                <Translate id="homepage.stats.hooks">React Hooks</Translate>
              </span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>100%</span>
              <span className={styles.statLabel}>
                <Translate id="homepage.stats.typescript">TypeScript</Translate>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

interface FeatureItem {
  title: string;
  icon: string;
  description: string;
  gradient: string;
}

function useFeatures(): FeatureItem[] {
  return [
    {
      title: translate({ id: 'homepage.feature.easyInstall.title', message: 'Easy Installation' }),
      icon: '📦',
      description: translate({
        id: 'homepage.feature.easyInstall.description',
        message: 'One-line install for both Expo and React Native CLI. Get started in minutes.'
      }),
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: translate({ id: 'homepage.feature.secureWallet.title', message: 'Secure Storage' }),
      icon: '🔐',
      description: translate({
        id: 'homepage.feature.secureWallet.description',
        message: 'Hardware-backed security with iOS Keychain and Android Keystore integration.'
      }),
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      title: translate({ id: 'homepage.feature.fastTx.title', message: 'Flashblocks' }),
      icon: '⚡',
      description: translate({
        id: 'homepage.feature.fastTx.description',
        message: 'Ultra-fast ~200ms preconfirmation for instant transaction feedback.'
      }),
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      title: translate({ id: 'homepage.feature.giwaId.title', message: 'GIWA ID' }),
      icon: '🏷️',
      description: translate({
        id: 'homepage.feature.giwaId.description',
        message: 'Human-readable addresses with ENS-based naming like alice.giwa.id.'
      }),
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
    {
      title: translate({ id: 'homepage.feature.bridge.title', message: 'L1↔L2 Bridge' }),
      icon: '🌉',
      description: translate({
        id: 'homepage.feature.bridge.description',
        message: 'Seamless asset transfers between Ethereum and GIWA Chain.'
      }),
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      title: translate({ id: 'homepage.feature.typescript.title', message: 'TypeScript Native' }),
      icon: '💎',
      description: translate({
        id: 'homepage.feature.typescript.description',
        message: 'Full type safety with comprehensive TypeScript definitions.'
      }),
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
  ];
}

function Feature({ title, icon, description, gradient }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.featureIconWrapper} style={{ background: gradient }}>
          <span className={styles.featureIcon}>{icon}</span>
        </div>
        <h3 className={styles.featureTitle}>{title}</h3>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures() {
  const features = useFeatures();
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <Translate id="homepage.features.title">Everything You Need</Translate>
          </h2>
          <p className={styles.sectionSubtitle}>
            <Translate id="homepage.features.subtitle">
              A complete toolkit for building blockchain-powered mobile applications
            </Translate>
          </p>
        </div>
        <div className="row">
          {features.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CodeExample() {
  const codeString = `import { GiwaProvider, useGiwaWallet } from '@giwa/react-native-wallet';

export default function App() {
  return (
    <GiwaProvider config={{ network: 'testnet' }}>
      <WalletScreen />
    </GiwaProvider>
  );
}

function WalletScreen() {
  const { wallet, createWallet, isLoading } = useGiwaWallet();

  if (isLoading) return <ActivityIndicator />;

  return wallet ? (
    <Text>Connected: {wallet.address}</Text>
  ) : (
    <Button title="Create Wallet" onPress={createWallet} />
  );
}`;

  return (
    <section className={styles.codeSection}>
      <div className="container">
        <div className="row">
          <div className="col col--5">
            <div className={styles.codeInfo}>
              <h2 className={styles.codeTitle}>
                <Translate id="homepage.code.title">Simple & Intuitive API</Translate>
              </h2>
              <p className={styles.codeDescription}>
                <Translate id="homepage.code.description">
                  Get started with just a few lines of code. Our React hooks make it easy to integrate
                  wallet functionality into any component.
                </Translate>
              </p>
              <ul className={styles.codeFeatures}>
                <li>
                  <span className={styles.checkIcon}>✓</span>
                  <Translate id="homepage.code.feature1">React Hooks for all features</Translate>
                </li>
                <li>
                  <span className={styles.checkIcon}>✓</span>
                  <Translate id="homepage.code.feature2">Automatic state management</Translate>
                </li>
                <li>
                  <span className={styles.checkIcon}>✓</span>
                  <Translate id="homepage.code.feature3">Built-in error handling</Translate>
                </li>
                <li>
                  <span className={styles.checkIcon}>✓</span>
                  <Translate id="homepage.code.feature4">TypeScript support</Translate>
                </li>
              </ul>
            </div>
          </div>
          <div className="col col--7">
            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  <span className={styles.codeDot} style={{ background: '#ff5f57' }} />
                  <span className={styles.codeDot} style={{ background: '#febc2e' }} />
                  <span className={styles.codeDot} style={{ background: '#28c840' }} />
                </div>
                <span className={styles.codeFilename}>App.tsx</span>
              </div>
              <pre className={styles.codeContent}>
                <code>{codeString}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstallSection() {
  return (
    <section className={styles.installSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <Translate id="homepage.install.title">Quick Installation</Translate>
          </h2>
          <p className={styles.sectionSubtitle}>
            <Translate id="homepage.install.subtitle">
              Choose your platform and get started in seconds
            </Translate>
          </p>
        </div>
        <div className={styles.installCards}>
          <div className={styles.installCard}>
            <div className={styles.installCardHeader}>
              <span className={styles.installIcon}>📱</span>
              <h3>Expo</h3>
            </div>
            <div className={styles.installCommand}>
              <code>npm install @giwa/react-native-wallet expo-secure-store</code>
            </div>
          </div>
          <div className={styles.installCard}>
            <div className={styles.installCardHeader}>
              <span className={styles.installIcon}>⚛️</span>
              <h3>React Native CLI</h3>
            </div>
            <div className={styles.installCommand}>
              <code>npm install @giwa/react-native-wallet react-native-keychain</code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            <Translate id="homepage.cta.title">Ready to Build?</Translate>
          </h2>
          <p className={styles.ctaDescription}>
            <Translate id="homepage.cta.description">
              Start building your blockchain-powered mobile app today.
            </Translate>
          </p>
          <div className={styles.ctaButtons}>
            <Link className={styles.ctaPrimaryButton} to="/docs">
              <Translate id="homepage.cta.docs">Read the Docs</Translate>
            </Link>
            <Link
              className={styles.ctaSecondaryButton}
              to="https://github.com/dev-eyoungmin/giwa-react-native-wallet"
            >
              <Translate id="homepage.cta.github">View on GitHub</Translate>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="GIWA Chain SDK for React Native - Expo and React Native CLI compatible"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <CodeExample />
        <InstallSection />
        <CTASection />
      </main>
    </Layout>
  );
}
