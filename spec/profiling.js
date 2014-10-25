(function (root, factory) {
    define([
        "jquery",
        "mock",
        "test_utils"
        ], function ($, mock, test_utils) {
            return factory($, mock, test_utils);
        }
    );
} (this, function ($, mock, test_utils) {
    describe("Profiling", function() {
        var roster;
        beforeEach(function() {
            roster = converse.connection.roster;
            converse.connection._changeConnectStatus(Strophe.Status.CONNECTED);
        });

        it("adds hundreds of contacts to the roster", $.proxy(function() {
        }, converse));

        it("adds hundreds of contacts to the roster, with roster groups", $.proxy(function() {
            // XXX: Try with groups for now (might also add a test without groups)
            converse.roster_groups = true;

            spyOn(this.roster, 'clearCache').andCallThrough();
            expect(this.roster.pluck('jid').length).toBe(0);

            var stanza = $iq({
                to: this.connection.jid,
                type: 'result',
                id: 'roster_1'
            }).c('query', {
                xmlns: 'jabber:iq:roster'
            });

            _.each(['Friends', 'Colleagues', 'Family', 'Acquaintances'], function (group) {
                var i, prefix = group.toLowerCase();
                for (i=0; i<100; i++) {
                    stanza = stanza.c('item', {
                        jid: prefix+i+'@example.net',
                        subscription:'both'
                    }).c('group').t('Friends').up().up();
                }
            });
            this.connection.roster._onReceiveRosterSuccess(null, stanza.tree());
            expect(this.roster.clearCache).toHaveBeenCalled();

            expect(this.roster.pluck('jid').length).toBe(400);
        }, converse));

        it("contacts in a very large roster change their statuses", $.proxy(function() {
        }, converse));
    });
}));
