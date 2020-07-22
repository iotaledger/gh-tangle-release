/* eslint-disable camelcase */
export interface IPayload {
    /**
     * The owner of the repo.
     */
    owner: string;

    /**
     * The name of the repo.
     */
    repo: string;

    /**
     * The tag for the release.
     */
    tag_name: string;

    /**
     * The name of the release.
     */
    name: string;

    /**
     * Comment for the release.
     */
    comment?: string;

    /**
     * The body content for the release.
     */
    body: string;

    /**
     * The url of the tarball.
     */
    tarball_url: string;

    /**
     * The signature for the tarball.
     */
    tarball_sig: string;

    /**
     * The url of the zipball.
     */
    zipball_url: string;

    /**
     * The signature for the zipball.
     */
    zipball_sig: string;

    /**
     * Additional assets for the release.
     */
    assets?: {
        /**
         * The name of the asset.
         */
        name: string;

        /**
         * The size of the asset.
         */
        size: number;

        /**
         * The url for the asset.
         */
        url: string;

        /**
         * The signature for the asset.
         */
        sig: string;
    }[];
}
