namespace SmartForm.API.Payloads
{
    public static class APIRoute
    {
        public const string Base = "api";

        public static class Forms
        {
            public const string GetAll = Base + "/forms";
            public const string GetActive = Base + "/forms/active";
            public const string GetById = Base + "/forms/{id}";
            public const string Create = Base + "/forms";
            public const string Update = Base + "/forms/{id}";
            public const string Delete = Base + "/forms/{id}";

            public const string AddField = Base + "/forms/{id}/fields";
            public const string UpdateField = Base + "/forms/{id}/fields/{fid}";
            public const string DeleteField = Base + "/forms/{id}/fields/{fid}";
            public const string ReorderFields = Base + "/forms/{id}/fields/reorder";

            public const string Submit = Base + "/forms/{id}/submit";
        }

        public static class Submissions
        {
            public const string GetAll = Base + "/submissions";
        }
    }
}
