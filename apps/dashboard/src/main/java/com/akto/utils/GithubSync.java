package com.akto.utils;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class GithubSync {

    public String syncDir(String repoUrl, String dirPath) {
        Map<String, String> dirContents = new HashMap<String, String>();
        OkHttpClient client = new OkHttpClient();

        Request getRequest = new Request.Builder()
                .url("https://api.github.com/repos/akto-api-security/akto/git/trees/master?recursive=1")
                .build();

        try {
            Response response = client.newCall(getRequest).execute();
            ResponseBody responseBody = response.body();


            if (responseBody != null) {
                String json = responseBody.string();
                JSONObject jsonObject = new JSONObject(json);
                JSONArray tree = jsonObject.getJSONArray("tree");
                for (Object treeNodeObject : tree) {
                    JSONObject treeNode = (JSONObject) treeNodeObject;
                    String path = treeNode.getString("path");
                    
                    if(path.contains(dirPath)) {
                        Request fileRequest = new Request.Builder()
                            .url("https://raw.githubusercontent.com/akto-api-security/akto/master/" + path)
                            .build();
                        Response fileResponse = client.newCall(fileRequest).execute();
                        ResponseBody fileResponseBody = fileResponse.body();
                        String fileContents = fileResponseBody.string();
                    
                        //String fileName = path.split("/")[-1];
                        System.out.println(fileContents);
                    }

                }
                //System.out.println(tree);
                return "";
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        return "";
    }
}