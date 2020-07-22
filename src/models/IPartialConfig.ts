export interface IPartialConfig {
    /**
     * GitHub token with access to the repo.
     */
    githubToken?: string;

    /**
     * The repository owner.
     */
    owner?: string;

    /**
     * The repository.
     */
    repository?: string;

    /**
     * The tag_name for the release.
     */
    releaseTag?: string;

    /**
     * The node to use for attaching the transaction.
     */
    node?: string;

    /**
     * Depth for attaching the transactions.
     */
    depth?: string | number;

    /**
     * MWM for attaching the transactions.
     */
    mwm?: string | number;

    /**
     * The seed for generating addresses.
     */
    seed?: string;

    /**
     * Address index to use for generating the transaction address.
     */
    addressIndex?: string | number;

    /**
     * Tag for the transactions.
     */
    transactionTag?: string;

    /**
     * The comment for the release.
     */
    comment?: string;

    /**
     * The url to use for displaying a tangle explore link.
     */
    explorerUrl?: string;
}
