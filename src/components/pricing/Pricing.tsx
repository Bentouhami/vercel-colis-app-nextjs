import styles from './Pricing.module.css';
import React from "react";

type Plan = {
    name: string,
    price: string,
    description: string,
    features: string[],
    buttonLabel: string,
    outline: boolean,
    key?: string
};

const plans: Plan[] = [
    {
        name: 'Mensuel',
        price: '20 EUR',
        description: 'Abonnement mensuel avec 5 livraisons incluses.',
        features: ['5 livraisons', 'Support standard', 'Notifications de suivi'],
        buttonLabel: "S'abonner",
        outline: true
    },
    {
        name: 'Trimestriel',
        price: '50 EUR',
        description: 'Abonnement trimestriel avec 15 livraisons incluses.',
        features: ['15 livraisons', 'Support prioritaire', 'Notifications de suivi avancées'],
        buttonLabel: "S'abonner",
        outline: false
    },
    {
        name: 'Annuel',
        price: '180 EUR',
        description: 'Abonnement annuel avec 60 livraisons incluses.',
        features: ['60 livraisons', 'Support premium', 'Notifications de suivi en temps réel'],
        buttonLabel: "S'abonner",
        outline: false
    },
    {
        name: 'Premium',
        price: '100 EUR',
        description: 'Abonnement premium avec livraisons illimitées.',
        features: ['Livraisons illimitées', 'Support 24/7', 'Notifications de suivi en temps réel', 'Livraison express'],
        buttonLabel: "S'abonner",
        outline: false
    },
];

const Plan: React.FC<Plan> = (props) => {
    return (
        <div className={`card mb-4 shadow-sm ${styles.plan}`}>
            <div className="card-header">
                <h4 className="my-0 font-weight-normal">{props.name}</h4>
            </div>
            <div className="card-body">
                <h1 className="card-title pricing-card-title">
                    {props.price}
                    <small className="text-muted"> / mois</small>
                </h1>
                <ul className={styles.list}>
                    {props.features.map((feature, i) => (
                        <li key={i} className={styles.listItem}>{feature}</li>
                    ))}
                </ul>
                <button
                    className={`btn btn-lg btn-block ${
                        props.outline ? 'btn-outline-primary' : 'btn-primary'
                    } ${styles.subscribeButton}`}
                    type="button"
                >
                    {props.buttonLabel}
                </button>
            </div>
        </div>
    );
};

const Pricing: React.FC = () => {
    return (
        <div className={styles.pricingContainer}>
            <h1 className={styles.pricingHeader}>Nos Plans d&apos;Abonnement</h1>
            <div className={`card-deck mb-3 text-center ${styles.plans}`}>
                {plans.map((plan) => (
                    <Plan key={plan.name} {...plan}/>
                ))}
            </div>
        </div>
    );
};

export default Pricing;
