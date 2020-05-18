CREATE EXTENSION plv8;

CREATE TABLE "images" (
  "imageId" UUID NOT NULL,
  "imageName" VARCHAR NOT NULL,
  "imageContentType" VARCHAR NOT NULL,
  "imageCreateAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "imageUpdatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "pkImagesImageId" PRIMARY KEY ("imageId")
);

CREATE FUNCTION "setUpdateAt"() 
RETURNS TRIGGER AS $$
  if (TG_OP == "UPDATE") {
    NEW[TG_ARGV[0] ? TG_ARGV[0] : "updatedAt"] = new Date();
  }
  return NEW;
$$ LANGUAGE "plv8";

CREATE TRIGGER "imagesSetUpdatedAt"
BEFORE UPDATE ON "images"
FOR EACH ROW
EXECUTE PROCEDURE "setUpdateAt"("imageUpdatedAt");
